import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Resenas as ResenasService } from '../../Services/resenas';
import { IResena } from '../../Interfaces/Iresena';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css',
})
export class ResenasComponent implements OnInit {
  private resenasService = inject(ResenasService);
  private router = inject(Router);

  listaResenas: IResena[] = [];
  resenasFiltradas: IResena[] = [];

  isAdmin = false;
  userId: number | null = null;

  // filtros
  filtroTexto = '';
  filtroRating = 0; // 0 = todas
  orden: 'fecha_desc' | 'fecha_asc' = 'fecha_desc';
  filtroRapido: 'all' | '5' | '4' | '3menos' | 'negativas' | 'sinTexto' = 'all';

  // stats (globales por defecto)
  stats = {
    total: 0,
    promedio: 0,
    porEstrellas: [0, 0, 0, 0, 0] as number[], // index 0=>1⭐ ... 4=>5⭐
  };

  async ngOnInit() {
    const role = localStorage.getItem('user_role');
    const idStored = localStorage.getItem('user_id');

    this.isAdmin = role === 'admin';
    this.userId = idStored ? parseInt(idStored, 10) : null;

    await this.cargarResenas();
  }

  async cargarResenas() {
    try {
      const todas = await this.resenasService.getResenas();

      this.listaResenas = this.isAdmin
        ? todas
        : todas.filter(r => Number(r.usuario_id) === Number(this.userId));

      this.recalcularStats(this.listaResenas);
      this.aplicarFiltros();
    } catch (error) {
      console.error('Error al traer reseñas:', error);
      Swal.fire('Error', 'No se pudieron cargar las reseñas.', 'error');
    }
  }

  setFiltroRapido(f: typeof this.filtroRapido) {
    this.filtroRapido = f;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let data = [...this.listaResenas];

    // ✅ filtros rápidos
    switch (this.filtroRapido) {
      case '5':
        data = data.filter(r => Number(r.puntuacion) === 5);
        break;
      case '4':
        data = data.filter(r => Number(r.puntuacion) === 4);
        break;
      case '3menos':
        data = data.filter(r => Number(r.puntuacion) <= 3);
        break;
      case 'negativas':
        data = data.filter(r => Number(r.puntuacion) <= 2);
        break;
      case 'sinTexto':
        data = data.filter(r => !r.comentario || !r.comentario.trim());
        break;
      default:
        break;
    }

    // 🔎 texto
    if (this.filtroTexto.trim()) {
      const txt = this.filtroTexto.toLowerCase();
      data = data.filter(r =>
        (r.comentario || '').toLowerCase().includes(txt) ||
        (r.nombre || '').toLowerCase().includes(txt)
      );
    }

    // ⭐ rating exacto
    if (this.filtroRating > 0) {
      data = data.filter(r => Number(r.puntuacion) === Number(this.filtroRating));
    }

    // ↕ orden
    if (this.orden === 'fecha_desc') {
      data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } else {
      data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    }

    this.resenasFiltradas = data;
  }

  // stats globales (si prefieres stats sobre filtradas, llama a esto con resenasFiltradas)
  private recalcularStats(data: IResena[]) {
    const total = data.length;
    const sum = data.reduce((acc, r) => acc + (Number(r.puntuacion) || 0), 0);
    const por = [0, 0, 0, 0, 0];

    for (const r of data) {
      const p = Number(r.puntuacion) || 0;
      if (p >= 1 && p <= 5) por[p - 1]++;
    }

    this.stats = {
      total,
      promedio: total ? +(sum / total).toFixed(1) : 0,
      porEstrellas: por,
    };
  }

  getBarPct(stars: number): number {
    const count = this.stats.porEstrellas[stars - 1] || 0;
    return this.stats.total ? Math.round((count / this.stats.total) * 100) : 0;
  }

  verDetalle(resena: IResena) {
    Swal.fire({
      title: `⭐ ${resena.puntuacion}/5`,
      html: `
        <div style="text-align:left">
          <p><strong>Cliente:</strong> ${resena.nombre || '—'}</p>
          <p><strong>Fecha:</strong> ${resena.fecha}</p>
          <hr style="border-color: rgba(255,255,255,.15);" />
          <p style="white-space: pre-wrap;">${resena.comentario || '(Sin comentario)'}</p>
        </div>
      `,
      background: '#1a1a1a',
      color: '#e6dcc9',
      confirmButtonColor: '#d4af37'
    });
  }

  volver() {
    this.router.navigate([this.isAdmin ? '/admin' : '/perfil-usuario']);
  }
}
