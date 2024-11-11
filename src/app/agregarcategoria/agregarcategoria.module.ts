import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarcategoriaPageRoutingModule } from './agregarcategoria-routing.module';

import { AgregarCategoriaPage } from './agregarcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AgregarcategoriaPageRoutingModule

  ],
  declarations: [AgregarCategoriaPage]

})
export class AgregarcategoriaPageModule {}
