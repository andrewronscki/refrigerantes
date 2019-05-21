import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Swal from 'sweetalert2';
import api from '../../services/api';
import "./styles.css";



export default class Main extends Component {
    
    state = {
        products: [],
        totalPrice: 0,
        price: 0,
    };

    componentDidMount() {
        this.loadProducts();
    };

    loadProducts = async () => {
        const response = await api.get();

        this.setState({ products: response.data});
    };

    handleChange = (event) => {   
        const setPrice =  {price: event.target.value };
        this.setState(setPrice);
    };

    handlerTotalPrice = () => {
        if(!this.refs.amount.value && (!this.state.price || this.state.price == 0)){
            Swal.fire('Atenção!', 'Você precisa selecionar um produto e uma quantidade.', 'warning');
        } else {
            if(!this.refs.amount.value) {
                Swal.fire('Atenção!', 'Você precisa informar uma quantidade.', 'warning');
            } else {
                if(this.refs.amount.value <= 0) {
                    Swal.fire('Atenção!', `A quantidade desejada precisa ser maior que 0, você nos informou: ${this.refs.amount.value}`, 'warning');
                } else {
                    if(this.state.price <= 0 || !this.state.price) {
                        Swal.fire('Atenção!', 'Você esqueceu de selecionar um produto.', 'warning');
                    } else {
                        const totalPrice = this.state.price *  this.refs.amount.value;
                        if(totalPrice > 0) {
                            const setTotalPrice = { totalPrice };
                            this.setState(setTotalPrice);
                            Swal.fire('Calculamos para você', `O valor total do(s) produto(s) é R$: ${totalPrice}` , 'success');
                        } else {
                            Swal.fire('Atenção!', 'Você esqueceu de por algum parâmetro, favor verificar', 'warning');
                        }              
                    }
                } 
            }       
        }        
    };

    render() {
        const { products } = this.state;
        
        return (            
            <div className="product-list">
                <article>
                    <strong>Selecione o seu refrigerante:</strong>
                    <select onChange={this.handleChange}>
                        <option value = {0}>Selecione</option>
                        {products.map(product => (                            
                            <option ref="product" key={product.id} value={product.valor}>
                                {product.sabor}, {product.quantidade}, R$: {product.valor}
                            </option>
                        ))}
                    </select>               
                </article>
                <article>
                    <strong>Selecione a quantidade desejada:</strong>
                    <input ref="amount" type="number" ></input>
                </article>

                <article>
                    <strong>Valor total:</strong>
                    <p>R$: {this.state.totalPrice}</p>
                </article>
                
                <button type="submit" onClick={() => this.handlerTotalPrice()}>CALCULAR VALOR<FontAwesome name='dollar' className="font-awesome"/></button>
            </div>
        );
    };
}