import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';


// import module
import { ElModule } from 'element-angular'

// if you use webpack, import style
import 'element-angular/theme/index.css';
import {MatTableModule} from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu';

import { LayoutComponent } from './layout/layout.component';
import { LeftContainerComponent } from './left-container/left-container.component';
import { CommonTableComponent } from './common-table/common-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MenuListComponent } from './menu-list/menu-list.component'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TopContainerComponent } from './top-container/top-container.component';
import {MatBadgeModule} from '@angular/material/badge';
import { MetaDataContainerComponent } from './meta-data-container/meta-data-container.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LayoutComponent,
    LeftContainerComponent,
    CommonTableComponent,
    MenuListComponent,
    TopContainerComponent,
    MetaDataContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSliderModule,
    MatMenuModule,
    MatIconModule,
    ElModule.forRoot(),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatBadgeModule,
    // MatCardHarness
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
