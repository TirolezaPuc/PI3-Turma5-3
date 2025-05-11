package com.example.fireauthtest

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay


class WelcomeActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WelcomeScreen()
        }
    }
}


/*
   TODO:
   Verificar se o usuario ja possui uma sessao ativa no aparelho
   Usar getInstance().currentUser
   Se for null, nao ha sesssao. Se sim, redirecionar a main.

 */

@Preview
@Composable
fun WelcomeScreen(){

    var showSplashScreen by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        delay(3000)
        showSplashScreen = false
    }

    if (showSplashScreen) {
        SplashScreen()
    }
    else{
        MainContent()
    }

    
}

@Composable
fun SplashScreen(){
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0, 61, 177)),
        contentAlignment = Alignment.Center
    ){
        Image(
            painter = painterResource(R.drawable.superid_logo_bluebackground),
            contentDescription = "Icone do SuperID"
        )
    }


}

@Composable
fun MainContent(){

    val context = LocalContext.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0, 61, 177))
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(50.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ){

        Box(
            modifier = Modifier
        ){
            Text(
                text = stringResource(R.string.welcome_screen_mainTitle),
                style = TextStyle(
                    fontWeight = FontWeight.Bold,
                    fontSize = 60.sp,
                    color = Color.White
                )
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Box(
            modifier = Modifier
        ){
            Text(
                text = stringResource(R.string.welcome_screen_subtitle),
                style = TextStyle(
                    fontSize = 20.sp,
                    color = Color.White
                )
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Box(
            modifier = Modifier
                .size(400.dp, 200.dp)
        ){
            Column(
                modifier = Modifier
                    .matchParentSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ){

                Text(
                    text = "Novo aqui?",
                    style = TextStyle(
                        color = Color.White,
                        fontStyle = FontStyle.Italic
                    )
                )

                Spacer(modifier = Modifier.height(5.dp))

                val interactionSource_btn1 = remember { MutableInteractionSource() }
                val isPressed1 by interactionSource_btn1.collectIsPressedAsState()
                val bgColor1 by animateColorAsState(
                    targetValue = if (isPressed1) Color(0xFFE0E0E0) else Color.White
                )

                Button(
                    onClick = {
                        val intent = Intent(context, SignUpActivity::class.java)
                        context.startActivity(intent)
                    },
                    modifier = Modifier
                        .width(180.dp)
                        .height(50.dp)
                        .border(1.dp, Color.Black, RoundedCornerShape(8.dp)),
                    shape = RoundedCornerShape(8.dp),
                    elevation = ButtonDefaults.buttonElevation(
                        defaultElevation = 8.dp,
                        pressedElevation = 2.dp
                    ),
                    interactionSource = interactionSource_btn1,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = bgColor1
                    )
                ) {
                    Text(
                        text = "Criar Conta",
                        style = TextStyle(
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Já possui conta?",
                    style = TextStyle(
                        color = Color.White,
                        fontStyle = FontStyle.Italic
                    )
                )

                Spacer(modifier = Modifier.height(5.dp))

                val interactionSource_btn2 = remember { MutableInteractionSource() }
                val isPressed by interactionSource_btn2.collectIsPressedAsState()
                val bgColor by animateColorAsState(
                    targetValue = if (isPressed) Color(0xFFE0E0E0) else Color.White
                )

                Button(
                    onClick = {
                        val intent = Intent(context, SignInActivity::class.java)
                        context.startActivity(intent)
                    },
                    modifier = Modifier
                        .width(180.dp)
                        .height(50.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                    )
                ){
                    Text(
                        text = "Entrar",
                        fontSize = 20.sp,
                        color = Color.Black,
                        fontWeight = FontWeight.Bold)
                }
            }
        }
    }

}