class AudioLoader {
    private readonly audioContext: AudioContext;
    private sources: { url: string, id: string }[];
    private readonly buffers: { [id: string]: AudioBuffer };
    private readonly sounds: { [id: string]: { sourceNode: AudioBufferSourceNode, gainNode: GainNode, volume: number } };
    private muted: boolean = false;
  
    constructor(sources: { url: string, id: string }[]) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sources = sources;
      this.buffers = {}
      this.sounds = {}
    }
  
    public load(callback: () => void) {
      Promise.all(
        this.sources.map(async source =>
          fetch(new Request(source.url))
            .then(response => response.arrayBuffer())
            .then((buffer) => this.audioContext.decodeAudioData(buffer, (b) => {
              this.buffers[source.id] = b;
            }))
        )
      ).then(callback);
    }
  
    public play (id: string, loop: boolean = false, volume: number = 1) {
      this.sounds[id] = this.sounds[id] || {};
  
      const sound = this.sounds[id];
      sound.sourceNode = this.audioContext.createBufferSource();
      sound.sourceNode.buffer = this.buffers[id];
      sound.sourceNode.loop = loop;
  
      if (!sound.gainNode) {
        sound.gainNode = this.audioContext.createGain();
        sound.gainNode.connect(this.audioContext.destination);
      }
  
      sound.sourceNode.connect(sound.gainNode);
      sound.volume = volume;
      if (this.muted) {
        this.volume(id, 0);
      } else {
        sound.gainNode.gain.value = sound.volume;
      }
      sound.sourceNode.start();
    }
  
    public status() {
      return this.audioContext.state;
    }
  
    public loop (id: string) {
      return this.play(id, true);
    }
  
    public volume(id: string, volume: number) {
      this.sounds[id].gainNode.gain.value = volume;
    }
  
    public resume() {
      this.audioContext.resume();
    }
  
    /**
     * Mute is a simple volume = 0 because suspending the audio context only create a "pause" on sound
     */
    public mute() {
      this.muted = true;
      Object.values(this.sounds).forEach(sound => {
        sound.gainNode.gain.value = 0
      })
    }
  
    public unmute() {
      this.muted = false;
      Object.values(this.sounds).forEach(sound => {
        sound.gainNode.gain.value = (sound.volume || 1);
      })
    }
  }
  
  export {
    AudioLoader
  }