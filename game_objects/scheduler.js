// color scheduler for ground
// eslint-disable-next-line no-unused-vars
class Scheduler {
  constructor() {
    this.idx = 1;
    this.colors = ['0xfffafa', '0x02193c', '0x3369AD', '0x008080', '0x233532', '0x990000'];
  }

  getNextColor() {
    let color = this.colors[this.idx];

    this.idx = (this.idx + 1) % this.colors.length;

    return color;
  }

  reset() {
    this.idx = 0;
  }
}
