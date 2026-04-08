import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { NotificacionRead } from '../../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-notificacion',
  imports: [CommonModule],
  templateUrl: './modal-notificacion.component.html',
  styleUrl: './modal-notificacion.component.css'
})
export class ModalNotificacionComponent implements OnInit, OnDestroy {

  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  notificaciones: NotificacionRead[] = [];
  private sub: Subscription | null = null;

  constructor(private notificacionesService: NotificacionesService) {}

  ngOnInit(): void {
    this.cargarNotificaciones();

    this.sub = this.notificacionesService.onNotificacion().subscribe(() => {
      this.cargarNotificaciones();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  cargarNotificaciones(): void {
    this.notificacionesService.getAll().subscribe({
      next: (notifs) => { this.notificaciones = notifs; },
      error: () => {}
    });
  }

  formatearTiempo(fecha: string): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 1) return 'ahora';
    if (minutos < 60) return `hace ${minutos}min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas}hrs`;
    return `hace ${Math.floor(horas / 24)} días`;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('notif-overlay')) {
      this.closed.emit();
    }
  }
}