import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Menus } from '../../Services/menus';

@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-menu.html',
  styleUrl: './edit-menu.css'
})
export class EditMenu implements OnInit {
  private menuService = inject(Menus);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  menuId!: number;

  form: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    fecha: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    activo: new FormControl(0)
  });

  async ngOnInit() {
    // 1. Obtener ID de la URL
    this.menuId = Number(this.route.snapshot.params['id']);

    // 2. Cargar datos
    try {
      const menus = await this.menuService.getAll(); // O getById si tienes esa función
      const menuEncontrado = menus.find(m => m.id === this.menuId);

      if (menuEncontrado) {
        // Rellenamos el formulario de golpe con patchValue
        this.form.patchValue({
          ...menuEncontrado,
          // Convertimos el activo (1/0) a booleano si tu switch lo requiere, 
          // o lo dejamos como número si el backend lo prefiere
          activo: menuEncontrado.activo === 1
        });
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los datos del menú', 'error');
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      // Preparamos los datos (convirtiendo el checkbox de nuevo a 1 o 0)
      const menuData = {
        ...this.form.value,
        activo: this.form.value.activo ? 1 : 0
      };

      await this.menuService.updateMenu(this.menuId, menuData);
      
      await Swal.fire({
        title: '¡Actualizado!',
        text: 'El menú se ha modificado correctamente',
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });
      
      this.router.navigate(['/admin-dashboard']); // Ajusta a tu ruta de gestión
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el menú', 'error');
    }
  }

  volver() {
    this.router.navigate(['/admin-dashboard']);
  }
}