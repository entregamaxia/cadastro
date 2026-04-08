import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro'; // Importe o componente que você criou

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CadastroComponent], // Adicione o CadastroComponent aqui no array de imports
  template: '<app-cadastro></app-cadastro>', // Aqui dizemos para o Angular renderizar seu cadastro
  styles: []
})
export class AppComponent {
  title = 'cadastro-itau';
}