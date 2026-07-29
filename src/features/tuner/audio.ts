import type { PlayingNote } from "@/types";

const PEAK = 0.18; // peak volume
const SUSTAIN = 0.08; // after "peak," volume "decays" to this level, and sustains volume until "duration" ends
const ATTACK = 0.02; // seconds, time to reach peak volume
const DECAY = 0.2; // seconds, time to decay from peak to sustain
const RELEASE = 0.4; // seconds, time to fade from "sustained" volume to 0

// calculate the gain value for a given audio envelope, so when playingNote.stop() is called, gain can be set and held to this value before fading to 0.
// this is necessary to create a smooth fade out, because the gain value is not necessarily at the sustain level when stop() is called. It could be anywhere between 0 and peak, depending on how long the note has been playing.
// Web Audio API does have built-in methods that do this, but they are not universal to all browsers, and their accuracy in getting gain levels at a given time is undesirably low, creating unusually loud notes when stop() is called during the attack phase.
function getEnvelopeGain(elapsed: number) {
  if (elapsed <= 0) {
    return 0;
  }

  if (elapsed < ATTACK) {
    // attack phase: gain ramps up linearly from 0 to peak
    return PEAK * (elapsed / ATTACK);
  }

  if (elapsed < ATTACK + DECAY) {
    // decay phase: gain decays exponentially from peak to sustain
    const progress = (elapsed - ATTACK) / DECAY;

    return PEAK * Math.pow(SUSTAIN / PEAK, progress);
  }

  // sustain phase: gain is at sustain level, where it remains until stop() initiates RELEASE phase
  return SUSTAIN;
}

// on keydown or pointerdown, generate a note with the given frequency, and return a function to stop it
// the returned function can be called on keyup or pointerup to stop the note
export function getPlayingNote(
  audioContext: AudioContext,
  hertz: number,
): PlayingNote {
  const oscillator = audioContext.createOscillator(); // creates an OscillatorNode which represents a periodic waveform, or constant tone
  const gainNode = audioContext.createGain(); // creates a GainNode, which controls the overall volume of the note

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(hertz, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const startTime = audioContext.currentTime;

  gainNode.gain.setValueAtTime(0, startTime); // start at volume 0
  gainNode.gain.linearRampToValueAtTime(PEAK, startTime + ATTACK); // ramp up to peak volume
  gainNode.gain.exponentialRampToValueAtTime(
    SUSTAIN,
    startTime + ATTACK + DECAY,
  ); // decay to sustain volume

  oscillator.start(startTime);

  let stopped = false;

  function stop() {
    if (stopped) return;
    stopped = true;

    const now = audioContext.currentTime;
    const attackEndTime = startTime + ATTACK;
    const currentGain = getEnvelopeGain(now - startTime);

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(currentGain, now);

    let releaseAt = now;

    if (now < attackEndTime) {
      // preserve the remainder of the attack for extremely light taps.
      gainNode.gain.linearRampToValueAtTime(PEAK, attackEndTime);
      releaseAt = attackEndTime;
    }

    gainNode.gain.linearRampToValueAtTime(0, releaseAt + RELEASE);

    oscillator.stop(releaseAt + RELEASE);
  }

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };

  return { hertz, stop };
}
