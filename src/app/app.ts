import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro'; // Caminho baseado no seu print

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CadastroComponent], // Adicionando o seu componente aqui
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'cadastro';
}