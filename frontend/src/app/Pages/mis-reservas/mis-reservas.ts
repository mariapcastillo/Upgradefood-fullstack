import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { IReserva } from '../../Interfaces/IReserva';
import { IResena } from '../../Interfaces/Iresena';
import { ReservaService } from '../../Services/reserva-service';
import { Resenas } from '../../Services/resenas';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservas implements OnInit {
  reservas = signal<IReserva[]>([]);
  loading = signal(true);
  error = signal('');

  private reservaService = inject(ReservaService);
  private resenaService = inject(Resenas);

  async ngOnInit() {
    await this.cargarReservas();
  }

  async cargarReservas() {
  

    this.loading.set(true);
    this.error.set('');

    try {
      // 1) Reservas del usuario
      const reservas = await this.reservaService.getMisReservas();

      // 2) Reseñas del usuario (tu endpoint: /mis-resenas)
      let reviews: IResena[] = [];
      try {
        reviews = await this.resenaService.getMisResenas();
      } catch (err) {
        console.warn('No se pudieron cargar mis reseñas:', err);
        // Si falla, seguimos: se verán reservas sin reseñas
      }

// 3) Map rápido por reserva_id (soporta nombres alternativos)
const reviewByReservaId = new Map<number, IResena>();

for (const rev of reviews) {
  const rid = Number((rev as any).reserva_id ?? (rev as any).reservaId);
  if (!Number.isNaN(rid) && rid > 0) {
    reviewByReservaId.set(rid, rev);
  }
}

// 4) Merge
const reservasMapeadas = reservas.map((r) => {
  const rid = Number(r.id);
  const rev = reviewByReservaId.get(rid);

  if (!rev) return r;

  return {
    ...r,
    resena_id: Number((rev as any).id),
    comentario_resena: String((rev as any).comentario ?? '').trim(),
    puntuacion: Number((rev as any).puntuacion) || 0,
  };
});

this.reservas.set(reservasMapeadas);

      this.reservas.set(reservasMapeadas);
    } catch (e) {
      console.error(e);
      this.error.set('Error al cargar reservas.');
    } finally {
      this.loading.set(false);
    }
  }

  async cancelar(r: IReserva) {
    if (!r.id) return;

    const result = await Swal.fire({
      title: '¿Anular reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      confirmButtonText: 'Sí, cancelar',
      background: '#1a1a1a',
      color: '#e6dcc9',
    });

    if (!result.isConfirmed) return;

    try {
      await this.reservaService.cancelarReserva(r.id);
      await this.cargarReservas();
      Swal.fire('Cancelada', 'Tu reserva ha sido anulada.', 'success');
    } catch (e) {
      Swal.fire('Error', 'No se pudo cancelar.', 'error');
    }
  }

  manejarResena(r: IReserva) {
    if (!this.esFechaPasada(r)) {
      Swal.fire({
        title: '¡Aún no!',
        text: 'Podrás escribir la reseña tras disfrutar de tu reserva.',
        icon: 'info',
        confirmButtonColor: '#d4af37',
        background: '#1a1a1a',
        color: '#e6dcc9',
      });
      return;
    }

    this.abrirModalResena(r);
  }

  // ✅ FIX: soporta hora "HH:mm" o segundos (number)
  esFechaPasada(r: IReserva): boolean {
    const [y, m, d] = r.fecha.split('-').map(Number);

    let hh = 0, mm = 0;
    if (typeof r.hora === 'string') {
      const parts = r.hora.split(':').map(Number);
      hh = parts[0] || 0;
      mm = parts[1] || 0;
    } else {
      hh = Math.floor(r.hora / 3600);
      mm = Math.floor((r.hora % 3600) / 60);
    }

    const fecha = new Date(y, m - 1, d, hh, mm, 0);
    return fecha.getTime() < Date.now();
  }

  async abrirModalResena(r: IReserva) {
    if (!r.id) return;

    const esEdicion = !!r.resena_id;

    const { value: formValues } = await Swal.fire({
      title: esEdicion ? 'Editar mi opinión' : 'Nueva reseña',
      background: '#1a1a1a',
      color: '#e6dcc9',
      html: `
        <select id="swal-rating" class="swal2-input" style="background:#333;color:white;border:1px solid #d4af37;">
          <option value="5" ${r.puntuacion === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
          <option value="4" ${r.puntuacion === 4 ? 'selected' : ''}>⭐⭐⭐⭐</option>
          <option value="3" ${r.puntuacion === 3 ? 'selected' : ''}>⭐⭐⭐</option>
          <option value="2" ${r.puntuacion === 2 ? 'selected' : ''}>⭐⭐</option>
          <option value="1" ${r.puntuacion === 1 ? 'selected' : ''}>⭐</option>
        </select>
        <textarea id="swal-comment" class="swal2-textarea" style="background:#333;color:white;border:1px solid #d4af37;">${r.comentario_resena || ''}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: esEdicion ? 'Actualizar' : 'Enviar',
      confirmButtonColor: '#d4af37',
      preConfirm: () => ({
        puntuacion: parseInt((document.getElementById('swal-rating') as HTMLSelectElement).value, 10),
        comentario: (document.getElementById('swal-comment') as HTMLTextAreaElement).value?.trim() || '',
      }),
    });

    if (!formValues) return;

    try {
      // ✅ NO mandamos usuario_id (backend debe tomarlo del token)
      const datosResena: IResena = {
        reserva_id: r.id,
        comentario: formValues.comentario,
        puntuacion: formValues.puntuacion,
        fecha: new Date().toISOString().split('T')[0],
      };

      if (esEdicion && r.resena_id) {
        await this.resenaService.updateResena(r.resena_id, datosResena);
        Swal.fire('¡Actualizada!', 'Tu reseña se ha modificado correctamente.', 'success');
      } else {
        await this.resenaService.createResena(datosResena);
        Swal.fire('¡Creada!', 'Gracias por tu reseña.', 'success');
      }

      await this.cargarReservas();
    } catch (e: any) {
      const msg = e?.error?.detail || 'Error al procesar la reseña.';
      Swal.fire('Atención', msg, 'warning');
    }
  }

  formatearHora(h: string | number) {
    if (typeof h === 'string') return h;
    const hh = Math.floor(Number(h) / 3600);
    const mm = Math.floor((Number(h) % 3600) / 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  estadoLabel(e?: string) {
    const l: any = { confirmada: 'Confirmada', cancelada: 'Cancelada', completada: 'Completada' };
    return l[e || ''] || e;
  }
}
