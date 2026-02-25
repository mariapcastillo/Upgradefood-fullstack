import { Component, EventEmitter, inject, Input, input, Output, signal } from '@angular/core';
import { IMenuDetalle } from '../../Interfaces/IMenuDetalle';
import { Menus } from '../../Services/menus';

@Component({
  selector: 'app-card-menu',
  imports: [],
  templateUrl: './card-menu.html',
  styleUrl: './card-menu.css',
})
export class CardMenu {
  
  datos = input.required<IMenuDetalle>();
 @Output() onVerPlato = new EventEmitter<number>(); 

  verDetallePlato(id: number) {
    this.onVerPlato.emit(id);
  }



 
  }

