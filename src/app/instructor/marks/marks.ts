import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarksService } from '../../services/marks';

@Component({
  selector: 'app-marks',
  imports: [FormsModule, CommonModule],
  templateUrl: './marks.html',
  styleUrls: ['./marks.css']
})
export class Marks {
  // temporary parsed students when uploading
  parsed: any[] = [];
  message = '';

  constructor(public marksService: MarksService) {}

  get students() {
    return this.marksService.students;
  }

  get published() {
    return this.marksService.published;
  }

  updateMarks(student: any, value: number) {
    const wasPublished = this.published;
    if (wasPublished) {
      // allow instructor to edit published marks — automatically unpublish
      this.marksService.published = false;
      this.message = 'Published marks unlocked for editing. Remember to publish again.';
      setTimeout(() => (this.message = ''), 2500);
    } else {
      this.message = 'Marks updated';
      setTimeout(() => (this.message = ''), 1500);
    }
    this.marksService.updateMarks(student, Number(value));
  }

  onFileSelected(ev: Event) {
    this.message = '';
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      this.parsed = this.parseCSV(text);
      this.message = `Loaded ${this.parsed.length} rows (preview).`;
    };
    reader.onerror = () => {
      this.message = 'Failed to read file';
    };
    reader.readAsText(file);
  }

  parseCSV(text: string) {
    const rows = text.split(/\r?\n/).map(r => r.trim()).filter(r => r.length > 0);
    if (rows.length === 0) return [];
    // detect header
    const header = rows[0].split(',').map(h => h.trim().toLowerCase());
    const hasHeader = header.includes('name') || header.includes('marks') || header.includes('course');
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const parsed = dataRows.map(r => {
      const cols = r.split(',').map(c => c.trim());
      if (hasHeader) {
        // map by header names
        const obj: any = {};
        header.forEach((h, i) => {
          obj[h] = cols[i] ?? '';
        });
        return { name: obj['name'] || obj['student'] || '', course: obj['course'] || '', marks: Number(obj['marks'] || obj['score'] || 0) };
      }
      // assume order: name, course, marks
      return { name: cols[0] || '', course: cols[1] || '', marks: Number(cols[2] || 0) };
    }).filter((s:any) => s.name);
    return parsed;
  }

  saveUploaded() {
    if (!this.parsed || this.parsed.length === 0) {
      this.message = 'No uploaded data to save.';
      return;
    }
    // replace the students list with parsed records
    this.marksService.replaceStudents(this.parsed);
    this.parsed = [];
    this.message = 'Uploaded marks saved.';
    setTimeout(() => (this.message = ''), 2000);
  }

  publish() {
    this.marksService.togglePublished();
    this.message = this.published ? 'Marks published — read-only now.' : 'Marks unpublished — editing enabled.';
    setTimeout(() => (this.message = ''), 2000);
  }
}
