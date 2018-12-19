import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Main areas
import { GitHubLinkAreaExampleModule } from './github-link-area/examples/github-link-area-example.module';
import { HomeModule } from './home/home.module';
import { MarkdownExampleModule } from './markdown/examples/markdown-example.module';
import { SlideOutExampleModule } from './slide-out-panel/examples/slide-out-example.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    GitHubLinkAreaExampleModule,
    HomeModule,
    MarkdownExampleModule,
    SlideOutExampleModule,
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
