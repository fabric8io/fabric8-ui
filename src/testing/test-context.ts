/**
 * Work derived from
 * https://github.com/youdz/dry-angular-testing/blob/39dffba0bda2fd7cfb14679716708fc2b2ff62b9/src/testing/test-context.ts
 * Hence below license
 *
 * MIT License
 *
 * Copyright (c) 2017 Eudes Petonnet-Vincent
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { DebugElement, Type } from '@angular/core';
import { async, ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class TestContext<T, H> {
  fixture: ComponentFixture<H>;
  hostComponent: H;
  tested: DebugElement;
  testedDirective: T;
  testedElement: any;

  detectChanges() {
    this.fixture.detectChanges();
  }

}

export function initContext<T, H>(testedType: Type<T>, hostType: Type<H>, moduleMetadata: TestModuleMetadata = {},
  customizer?: (t: T) => void) {
  beforeEach(function() {
    /*
     * Jasmine creates plain objects and modifying their prototype is definitely a bad idea.
     * So until we find better way..
     */
    Object.assign(this, TestContext.prototype);
  });

  beforeEach(async(function(this: TestContext<T, H>) {
    const declarations = [ testedType, hostType ];
    if (moduleMetadata && moduleMetadata.declarations) {
      declarations.push(...moduleMetadata.declarations);
    }
    TestBed.configureTestingModule({...moduleMetadata, declarations: declarations })
      .compileComponents();
  }));

  beforeEach(function(this: TestContext<T, H>) {
    this.fixture = TestBed.createComponent(hostType);
    this.hostComponent = this.fixture.componentInstance;
    const testedDebugElement = this.fixture.debugElement.query(By.directive(testedType));
    if (!testedDebugElement) {
      throw new Error('Unable to find component under test of type '
        + testedType.name
        + '. Please check your '
        + hostType.name
        + ' in the failing test');
    }
    this.tested = testedDebugElement;
    this.testedDirective = testedDebugElement.injector.get(testedType);
    this.testedElement = testedDebugElement.nativeElement;

    if (customizer) {
      customizer(this.testedDirective);
    }
    this.fixture.detectChanges();
  });

  afterEach(function(this: TestContext<T, H>) {
    if (this.fixture) {
      this.fixture.destroy();
      this.fixture.nativeElement.remove();
    }
  });
}

