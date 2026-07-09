export function playNote(audioContext: AudioContext, hertz: number) {
  const oscillator = audioContext.createOscillator(); // creates an OscillatorNode which represents a periodic waveform, or constant tone
  const gainNode = audioContext.createGain(); // creates a GainNode, which controls the overall volume of the note

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(hertz, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;
  const duration = 1.5; // seconds

  const peak = 0.18; // peak volume
  const sustain = 0.08; // after "peak," volume "decays" to this level, and sustains volume until "duration" ends
  const release = 0.4; // seconds, time to fade from "sustained" volume to 0

  const attack = 0.02; // seconds, time to reach peak volume
  const decay = 0.2; // seconds, time to decay from peak to sustain

  gainNode.gain.setValueAtTime(0, now); // start at volume 0
  gainNode.gain.linearRampToValueAtTime(peak, now + attack); // ramp up to peak volume
  gainNode.gain.exponentialRampToValueAtTime(sustain, now + attack + decay); // decay to sustain volume
  gainNode.gain.setValueAtTime(sustain, now + duration - release); // hold sustain volume until it's time to release
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}
