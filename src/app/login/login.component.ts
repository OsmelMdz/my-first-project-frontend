import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  miFormulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: AuthService, private tokenService: TokenService, private router: Router) {
    this.miFormulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  save() {
    const email = this.miFormulario.get('email')?.value;
    const password = this.miFormulario.get('password')?.value;
    this.loginService.login(email, password).subscribe(
      (data) => {
        console.log("Token: ", data.token);
        if (!data.token) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No tienes acceso',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          console.log(data);
          this.tokenService.setToken(data.token);
          console.log('Bienvenido Usuario');
          console.log(this.tokenService.isLogged());
          if (this.tokenService.isLogged() == true) {
            this.router.navigate(['home']);
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'No tienes acceso',
              showConfirmButton: false,
              timer: 1500
            })
          }
          this.miFormulario.reset();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Bienvenido Usuario',
            showConfirmButton: false,
            timer: 1500
          })
        }
      },
      error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Algo anda mal',
          showConfirmButton: false,
          timer: 1500
        })
      }
    );
  }
}
