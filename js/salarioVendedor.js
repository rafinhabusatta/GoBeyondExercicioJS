class Vendedor {
    constructor(nome, salarioFixo, vendasMes) {
        this.nome = nome
        this.salarioFixo = salarioFixo
        this.vendasMes = vendasMes
    }

    verificaDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                //dados inválidos
                return false
            }
        }
        //dados válidos
        return true
    }  
}

function cadastrarVendedor() {
    let form = document.querySelector("#form")
    let vendedor = document.querySelector("#vendedor")
    let salario = document.querySelector("#salario")
    let totalVendas = document.querySelector("#total-vendas")

    let modalText = document.querySelector("#modal-text")
    let modalBtn = document.querySelector("#btn-back")
    let modalTitle = document.querySelector("#caixaDeDialogoDeRegistro")
    let modalBody = document.querySelector("#body")

    let novoVendedor = new Vendedor(
        vendedor.value, 
        salario.value, 
        totalVendas.value,
    )

    if(novoVendedor.verificaDados()) {
        //dados são gravados
        bd.gravar(novoVendedor)
        carregaListaVendedores()
        $('#modalRegistraVendedor').modal('show')
        modalText.className = "modal-header text-success"
        modalBtn.className = "btn btn-success"
        modalTitle.innerHTML = "Registro inserido com sucesso"
        modalBody.innerHTML = "Vendedor foi cadastrado com sucesso!"
        form.reset()
    }
    else {
        //dados não serão armazenados
        $('#modalRegistraVendedor').modal('show')
        modalText.className = "modal-header text-danger"
        modalBtn.className = "btn btn-danger"
        modalTitle.innerHTML = "Erro na inclusão de registro"
        modalBody.innerHTML = "Erro, verifique se todos os dados do formulário foram preenchidos corretamente e tente novamente!"
    }
}

let vendedor = new Vendedor()

class BD {
    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId) + 1)  
    }

    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let id = localStorage.getItem('id')
        let vendedores = Array()

        for(let i = 1; i <= id; i++) {

            let vendedor = JSON.parse(localStorage.getItem(i)) //leitura do localStorage do vendedor e conversão de JSON para Objeto
            if(vendedor === null) {
                continue // pula para a próxima iteração do laço
            }
            vendedor.id = i
            vendedores.push(vendedor) //inclui o vendedor no array vendedores
        } 
        return vendedores 
    }

    removerVendedor(id) {
        localStorage.removeItem(id)
        location.reload()
    }
}

let bd = new BD()

function carregaListaVendedores(vendedores = Array(), filtro = false) {
    if(vendedores.length == 0 && filtro == false) {
        vendedores = bd.recuperarTodosRegistros()
    }
        
    let tableBody = document.querySelector("#table-body") //corpo da tabela
    tableBody.innerHTML = ''
    //let i = 0

    vendedores.forEach(function(vendedor) {
        let trNova = tableBody.insertRow()
        let salarioFinal = parseInt(vendedor.salarioFixo) + vendedor.vendasMes * 0.15

        trNova.insertCell(0).innerHTML = vendedor.nome
        trNova.insertCell(1).innerHTML = `R$${vendedor.salarioFixo}`
        trNova.insertCell(2).innerHTML = `R$${vendedor.vendasMes}`
        trNova.insertCell(3).innerHTML = salarioFinal

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<span aria-hidden="true">&times;</span>'
        btn.id = `id_vendedor_${vendedor.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_vendedor_', '')
            bd.removerVendedor(id)
        }
        trNova.insertCell(4).append(btn)
    })
}