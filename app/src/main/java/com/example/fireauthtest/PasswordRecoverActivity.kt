package com.example.fireauthtest

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.text.Layout
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Arrangement.Top
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MailOutline
import androidx.compose.material.icons.rounded.Email
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CheckboxDefaults.colors
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldColors
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.credentials.exceptions.domerrors.NamespaceError
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth


class PasswordRecoverActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PasswordRecoverScreen()
        }
    }
}

class EmailTextFieldController(
    val emailInput : MutableState<String>
){
    var emailValue : String
        get() = emailInput.value
        set(value) { emailValue = value }

    val isEmailFormatValid : Boolean
        get() = android.util.Patterns.EMAIL_ADDRESS.matcher(emailValue).matches()

    val isEmailFieldNotEmpty : Boolean
        get() = emailValue.isNotEmpty()

    val validEmailInput : Boolean
        get() = isEmailFormatValid && isEmailFieldNotEmpty
}


@Composable
fun PasswordRecoverScreen(){

    var emailInput = remember { mutableStateOf("") }

    val EmailInputController = remember { EmailTextFieldController(emailInput) }

    var showSuccessDialog = remember { mutableStateOf(false) }
    var showFailedDialog = remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    )

    
    Box(
        modifier = Modifier
            .fillMaxSize()
    ){
        Column(
            modifier = Modifier
                .matchParentSize()
                .padding(30.dp),
            verticalArrangement = Arrangement.Center
        ){

            if(showSuccessDialog.value){
                SuccessDialog(
                    onDismissRequest = {
                        showSuccessDialog.value = false
                    }
                )
            }

            if(showFailedDialog.value){
                FailedDialog(
                    onDismissRequest = {
                        showFailedDialog.value = false
                    }
                )
            }

            Text(
                text = "Recuperação de Senha",
                modifier = Modifier,
                style = TextStyle(
                    color = Color.White,
                    fontSize = 35.sp,
                    fontWeight = FontWeight.Bold
                )
            )

            Spacer(modifier = Modifier.height(200.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ){
                Text(
                    text = "Informe o e-mail associado à sua conta SuperID",
                    style = TextStyle(
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )

            }

            Spacer(modifier = Modifier.height(30.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ){
                Icon(
                    imageVector = Icons.Rounded.Email,
                    contentDescription = "Ícone de Email",
                    tint = Color.White
                )

                Spacer(modifier = Modifier.width(15.dp))

                OutlinedTextField(
                    value = emailInput.value,
                    onValueChange = { emailInput.value = it },
                    singleLine = true,
                    label = {
                        Text(
                            text = "Email de Recuperação",
                            style = TextStyle(
                                color = Color.White
                            )
                        )
                    },
                    colors = TextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = Color.Black,
                        unfocusedContainerColor = Color.Black
                    )
                )
            }

            Spacer(modifier = Modifier.height(30.dp))

            Text(
                text = "Se este endereço estiver cadastro, você receberá uma mensagem automatizada para redefinição de senha",
                style = TextStyle(
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Justify
                )
            )

            Spacer(modifier = Modifier.height(40.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ){
                SendResetEmailButton(
                    emailInput,
                    EmailInputController,
                    showSuccessDialog,
                    showFailedDialog
                )
            }

            Spacer(modifier = Modifier.height(200.dp))
        }
    }
}


@Composable
fun SendResetEmailButton(
    email: MutableState<String>,
    inputController : EmailTextFieldController,
    showSuccessDialog : MutableState<Boolean>,
    showFailedDialog : MutableState<Boolean>
){

    Button(
        onClick = {
            val auth = FirebaseAuth.getInstance()

            auth.sendPasswordResetEmail(email.value)
                .addOnCompleteListener { task ->
                    if(task.isSuccessful){
                        Log.d("PasswordRecoverActivity", "Password recover email successfully sent")
                        showSuccessDialog.value = true
                    }
                    else {
                        Log.e("PasswordRecoverActivity", "Failed to send password recover email. Exception = ${task.exception}")
                        showFailedDialog.value = true
                    }
                }
        },
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(255, 65, 0),
            disabledContainerColor = Color.Gray
        ),
        enabled = inputController.validEmailInput

    ) {
        Text(
            text = "Enviar Email de Recuperação",
            color = Color.White
        )
    }
}

@Composable
fun SuccessDialog(
    onDismissRequest : () -> Unit
){

    val context = LocalContext.current

    Dialog(
        onDismissRequest = onDismissRequest
    ) {

        Surface(
            shape = RoundedCornerShape(20.dp),
            tonalElevation = 8.dp
        ) {
            Box(
                modifier = Modifier
                    .background(Color.White)
                    .size(270.dp)
                    .padding(25.dp)
            ){
                Column(
                    modifier = Modifier
                        .matchParentSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceEvenly
                ){

                    Icon(
                        imageVector = Icons.Default.MailOutline,
                        modifier = Modifier.size(50.dp),
                        tint = Color.Green,
                        contentDescription = "Ícone de Email"
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Email de Recuperação Enviado",
                        style = TextStyle(
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            textAlign = TextAlign.Center
                        )
                    )

                    Text(
                        text = "Siga as instruções contidas no email para redefinir sua senha. Certifique-se de que o email não está em sua caixa de spam.",
                        style = TextStyle(
                            fontWeight = FontWeight.Light,
                            textAlign = TextAlign.Center
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ){
                        TextButton(
                            onClick = {
                                val intent = Intent(context, SignInActivity::class.java)
                                context.startActivity(intent)
                            }
                        ){
                            Text("Fazer Login")
                        }

                        TextButton(
                            onClick = onDismissRequest
                        ) {
                            Text("Fechar")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FailedDialog(
    onDismissRequest : () -> Unit
){

    Dialog(
        onDismissRequest = onDismissRequest
    ) {

        Surface(
            shape = RoundedCornerShape(20.dp),
            tonalElevation = 8.dp
        ) {
            Box(
                modifier = Modifier
                    .background(Color.White)
                    .size(270.dp)
                    .padding(25.dp)
            ){
                Column(
                    modifier = Modifier
                        .matchParentSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceEvenly
                ){

                    Icon(
                        painter = painterResource(R.drawable.error_icon),
                        tint = Color.Red,
                        modifier = Modifier.size(50.dp),
                        contentDescription = "Ícone de Erro"
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Não foi possível enviar email de recuperação",
                        style = TextStyle(
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            textAlign = TextAlign.Center
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Algo deu errado. Nossos engenheiros estão quebrando a cabeça para resolver. Tente novamente mais tarde.",
                        style = TextStyle(
                            fontWeight = FontWeight.Light,
                            textAlign = TextAlign.Center
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ){
                        TextButton(
                            onClick = onDismissRequest
                        ) {
                            Text("Fechar")
                        }
                    }
                }
            }
        }
    }
}