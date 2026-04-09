import { Component } from '@angular/core'; // <--- O certo é 'core'
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

// Registra o formato brasileiro para moedas e datas
registerLocaleData(localePt);

interface Movimentacao {
  data: Date;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss']
})
    export class ExtratoComponent {
    
    saldoAtual = 1250.75;

    extrato: Movimentacao[] = [
        { data: new Date(2026, 3, 9), descricao: 'Pix Recebido - Ana Maria', valor: 250.00, tipo: 'entrada', categoria: 'Pix' },
        { data: new Date(2026, 3, 8), descricao: 'Posto de Gasolina Shell', valor: -180.00, tipo: 'saida', categoria: 'Transporte' },
        { data: new Date(2026, 3, 8), descricao: 'Restaurante Sabor Local', valor: -45.90, tipo: 'saida', categoria: 'Alimentação' },
        { data: new Date(2026, 3, 7), descricao: 'Transferência Recebida', valor: 1200.00, tipo: 'entrada', categoria: 'TED' },
        { data: new Date(2026, 3, 6), descricao: 'Netflix Mensalidade', valor: -55.90, tipo: 'saida', categoria: 'Lazer' },
    ];
    }