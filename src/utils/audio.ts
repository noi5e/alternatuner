export function playNote(audioContext: AudioContext, hertz: number) {
  const oscillator = audioContext.createOscillator(); // creates an OscillatorNode which represents a periodic waveform, or constant tone
  const gainNode = audioContext.createGain(); // creates a GainNode, which controls the overall volume of the note

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(hertz, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;
  const duration = 1.5; // seconds
  const volume = 0.15;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.setValueAtTime(volume, now + duration - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}
