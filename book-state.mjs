// Pure navigation state: the book always waits for the teacher.
export class BookCursor {
  constructor(pages, saved = {}) {
    this.pages = pages;
    this.page = Number.isInteger(saved.page) && saved.page >= 0 && saved.page < pages.length ? saved.page : 0;
    this.beat = Number.isInteger(saved.beat) && saved.beat >= 0 && saved.beat < this.current.beats.length ? saved.beat : 0;
  }
  get current() { return this.pages[this.page]; }
  get passage() { return this.current.beats[this.beat]; }
  get lastBeat() { return this.beat === this.current.beats.length - 1; }
  get lastPage() { return this.page === this.pages.length - 1; }
  get canSolve() { return this.lastBeat && !!this.current.puzzle; }
  get atStart() { return this.page === 0 && this.beat === 0; }
  next() {
    if (!this.lastBeat) { this.beat++; return true; }
    return this.nextPage();
  }
  nextPage() {
    if (this.lastPage) return false;
    this.page++; this.beat = 0; return true;
  }
  previous() {
    if (this.beat > 0) { this.beat--; return true; }
    if (this.page === 0) return false;
    this.page--; this.beat = this.current.beats.length - 1; return true;
  }
  goPage(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.pages.length) return false;
    this.page = index; this.beat = 0; return true;
  }
  snapshot() { return {page: this.page, beat: this.beat}; }
}
