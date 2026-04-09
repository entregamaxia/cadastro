import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Angular Material Imports
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule, // Adicionado para o Select de profissão
    MatOptionModule  // Adicionado para as opções do Select
  ],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  loading = false;

  // Lista de profissões para o select
  profissoes: string[] = [
    'Analista de Sistemas',
    'Desenvolvedor(a)',
    'Médico(a)',
    'Advogado(a)',
    'Autônomo(a)',
    'Outros'
  ];

  constructor(private _fb: FormBuilder, private http: HttpClient) {}

  // Getters para facilitar o acesso no HTML
  get identificacaoGroup(): FormGroup {
    return this.cadastroForm.get('identificacao') as FormGroup;
  }

  get enderecoGroup(): FormGroup {
    return this.cadastroForm.get('endereco') as FormGroup;
  }

  get financeiroFormGroup(): FormGroup {
    return this.cadastroForm.get('financeiro') as FormGroup;
  }

  ngOnInit() {
    this.cadastroForm = this._fb.group({
      identificacao: this._fb.group({
        nacionalidade: ['brasileira', Validators.required],
        nome: ['', [Validators.required, Validators.minLength(3)]],
        documento: ['', [Validators.required]]
      }),
      // Novo grupo financeiro que adicionamos
      financeiro: this._fb.group({
        profissao: ['', Validators.required],
        rendaMensal: [null, [Validators.required, Validators.min(1)]]
      }),
      endereco: this._fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      })
    });
  }

  buscarCep() {
    const cep = this.cadastroForm.get('endereco.cep')?.value;
    if (cep?.length === 8) {
      // Simulação de preenchimento da API
      this.cadastroForm.get('endereco')?.patchValue({
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      });
    }
  }

  finalizar() {
    if (this.cadastroForm.valid) {
      console.log('Payload para AWS:', this.cadastroForm.value);
      alert('Cadastro finalizado com sucesso! Enviando para AWS...');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}