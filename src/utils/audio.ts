import type { PlayingNote } from "@/types";

const PEAK = 0.18; // peak volume
const SUSTAIN = 0.08; // after "peak," volume "decays" to this level, and sustains volume until "duration" ends
const ATTACK = 0.02; // seconds, time to reach peak volume
const DECAY = 0.2; // seconds, time to decay from peak to sustain
const RELEASE = 0.4; // seconds, time to fade from "sustained" volume to 0

function holdGainAtCurrentTime(gain: AudioParam, now: number) {
  if (typeof gain.cancelAndHoldAtTime === "function") {
    gain.cancelAndHoldAtTime(now); // this method is not supported in firefox, check to see if it is defined.
    return;
  } else {
    // fallback for firefox
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
  }
}

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

  const now = audioContext.currentTime;

  gainNode.gain.setValueAtTime(0, now); // start at volume 0
  gainNode.gain.linearRampToValueAtTime(PEAK, now + ATTACK); // ramp up to peak volume
  gainNode.gain.exponentialRampToValueAtTime(SUSTAIN, now + ATTACK + DECAY); // decay to sustain volume

  oscillator.start(now);

  let stopped = false;

  function stop() {
    if (stopped) return;
    stopped = true;

    const now = audioContext.currentTime;
    holdGainAtCurrentTime(gainNode.gain, now);
    gainNode.gain.linearRampToValueAtTime(0, now + RELEASE); // fade to 0 volume
    oscillator.stop(now + RELEASE);
  }

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };

  return { stop };
}
