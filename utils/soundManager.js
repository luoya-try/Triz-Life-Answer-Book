// 音效管理器 - 用于任务完成时播放音效提示

class SoundManager {
  constructor() {
    this.enabled = true;
    this.volumes = {
      success: 0.5,
      complete: 0.6,
      warning: 0.4,
      error: 0.3
    };
    this.innerAudioContext = null;
  }

  // 启用/禁用音效
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // 设置音量
  setVolume(type, volume) {
    if (this.volumes[type] !== undefined) {
      this.volumes[type] = Math.max(0, Math.min(1, volume));
    }
  }

  // 创建音频上下文
  createAudioContext() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.obeyMuteSwitch = false;
  }

  // 播放音效
  play(type) {
    if (!this.enabled) return;

    // 创建音频上下文
    this.createAudioContext();

    let sound;

    switch (type) {
      case 'success':
        sound = this.getSuccessSound();
        break;
      case 'complete':
        sound = this.getCompleteSound();
        break;
      case 'warning':
        sound = this.getWarningSound();
        break;
      case 'error':
        sound = this.getErrorSound();
        break;
      case 'switch':
        sound = this.getSwitchSound();
        break;
      case 'save':
        sound = this.getSaveSound();
        break;
      case 'click':
        sound = this.getClickSound();
        break;
      default:
        sound = this.getSuccessSound();
    }

    // 使用AudioContext生成音效（无需音频文件）
    this.playTone(sound.frequency, sound.duration, sound.volume, sound.type);
  }

  // 使用Tone.js风格的实现（简化版）
  playTone(frequency, duration, volume, type = 'sine') {
    try {
      // 使用微信小程序的音频API
      this.innerAudioContext.src = this.generateToneDataUrl(frequency, duration, type);
      this.innerAudioContext.volume = volume || 0.5;
      this.innerAudioContext.play();

      // 播放完后销毁
      this.innerAudioContext.onEnded(() => {
        if (this.innerAudioContext) {
          this.innerAudioContext.destroy();
          this.innerAudioContext = null;
        }
      });
    } catch (error) {
      console.error('音效播放失败:', error);
    }
  }

  // 生成音效数据URL（简单的正弦波）
  generateToneDataUrl(frequency, duration, type) {
    // 简化实现：返回一个静音占位
    // 实际使用时可以集成Web Audio API生成真实的音效
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
  }

  // 成功音效 - 清脆的叮声
  getSuccessSound() {
    return {
      frequency: 523.25,  // C5
      duration: 0.15,
      volume: 0.5,
      type: 'sine'
    };
  }

  // 完成音效 - 双音叮叮声
  getCompleteSound() {
    // 播放双音
    setTimeout(() => {
      this.playTone(659.25, 0.15, 0.55, 'sine');  // E5
    }, 100);
    return {
      frequency: 523.25,  // C5
      duration: 0.15,
      volume: 0.55,
      type: 'sine'
    };
  }

  // 警告音效
  getWarningSound() {
    return {
      frequency: 440,  // A4
      duration: 0.1,
      volume: 0.4,
      type: 'triangle'
    };
  }

  // 错误音效
  getErrorSound() {
    return {
      frequency: 261.63,  // C4
      duration: 0.2,
      volume: 0.3,
      type: 'sawtooth'
    };
  }

  // 切换音效
  getSwitchSound() {
    return {
      frequency: 783.99,  // G5
      duration: 0.08,
      volume: 0.35,
      type: 'sine'
    };
  }

  // 保存音效
  getSaveSound() {
    setTimeout(() => {
      this.playTone(659.25, 0.12, 0.45, 'sine');  // E5
    }, 80);
    setTimeout(() => {
      this.playTone(783.99, 0.15, 0.5, 'sine');  // G5
    }, 160);
    return {
      frequency: 523.25,  // C5
      duration: 0.1,
      volume: 0.45,
      type: 'sine'
    };
  }

  // 点击音效
  getClickSound() {
    return {
      frequency: 880,  // A5
      duration: 0.05,
      volume: 0.2,
      type: 'sine'
    };
  }

  // 销毁音效管理器
  destroy() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
    this.enabled = true;
  }
}

// 创建单例
const soundManager = new SoundManager();

module.exports = soundManager;
