const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged( user => {
    if(user){
        console.log(user)
        botones.innerHTML = /*html*/` 
        <button class="btnCerrarSesion" id='btnCerrarSesion'>Cerrar Sesión</button>
        `
        nombreUsuario.innerHTML =user.displayName
        cerrarSesion()
        formulario.classList = 'input-group  py-2 fixed-bottom container'
        
        contenidoChat(user)
    }else{
        console.log('No existe user')
        botones.innerHTML = /*html*/` 
        <button class="btnAcceder" id='btnAcceder'>Acceder</button>
        `
        iniciarSesion()
        nombreUsuario.innerHTML = /*html*/`
        <h2>DonaChat</h2>
        `
        
        contenidoProtegido.innerHTML= /*html*/`
        <p class="letra">Debes iniciar sesión</p>
        `
        formulario.classList = 'input-group  py-2 fixed-bottom container d-none'
    }
})

const contenidoChat = (user) => {
    
    formulario.addEventListener('submit',(e) => {
        e.preventDefault()
        console.log('Procensando formulario')
        console.log(inputChat.value)

        if(!inputChat.value.trim()){
            console.log('input vacio')
            return
        }
        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
            .then(res=> {console.log('Mensaje guardado')})
            .catch(e=> console.log(e))
        inputChat.value=''
    })

    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query =>{
            contenidoProtegido.innerHTML =''
            query.forEach(doc => {
                console.log(doc.data())
                if(doc.data().uid === user.uid){
                    contenidoProtegido.innerHTML += /*html*/`
                        <div class="d-flex justify-content-end">
                            <span class="texto2">${doc.data().texto}</span>
                        </div>`
                }else{
                    contenidoProtegido.innerHTML += /*html*/`
                        <div class="d-flex d-flex justify-content-star">
                            <span class="texto1" >${doc.data().texto}</span>
                        </div>`
                        
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
            })
    })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut()
    })
}
const iniciarSesion = () =>{
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        console.log('Me diste click en acceder')
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        } catch(error) {
            console.log(error)
        }
    })
    
    
}