import { Pipe, PipeTransform } from '@angular/core';
/*
 * Appends size info to Avatar URL
 * Usage:
 *   URL | almAvatarSize:size
 * Example:
 *   {{ URL |  almAvatarSize:20}}
 *   formats to: URL&s=20
 */
@Pipe({ name: 'almAvatarSize' })
export class AlmAvatarSize implements PipeTransform {
  transform(value: number, size: string): string {
    return `${value}&s=${size}`;
  }
}
