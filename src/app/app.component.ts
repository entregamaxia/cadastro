import { Component } from '@angular/core';
import { CadastroComponent } from './components/cadastro/cadastro';
import { ExtratoComponent } from './components/cadastro/extrato.component';
import { MatTabsModule } from '@angular/material/tabs'; // <--- ADICIONE ESTE IMPORT

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CadastroComponent, 
    ExtratoComponent,
    MatTabsModule // <--- ADICIONE NA LISTA DE IMPORTS
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent { }