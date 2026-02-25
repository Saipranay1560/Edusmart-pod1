import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true // Must be true since you are using Standalone Components
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) return '';

  
    if (url.includes('watch?v=')) {
      url = url.replace('watch?v=', 'embed/');
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}