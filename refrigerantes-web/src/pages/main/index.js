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

    handlerTotalPrice = () => {
        const calculate = this.state.price *  this.refs.amount.value;
        const setTotalPrice = { totalPrice: calculate };
        this.setState(setTotalPrice)
            if(calculate > 0) {
                Swal.fire('Calculamos para você', `O valor total do(s) produto(s) é 
                R$: ${calculate}` , 'success');
            } else {
                Swal.fire('Atenção!', 'Você esqueceu de por algum parâmetro, favor verificar' 
                , 'warning')
            }
        
    };

    handleChange = (event) => {   
        const setPrice =  {price: event.target.value };
        this.setState(setPrice);
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
                                {product.sabor}, {product.quantidade}
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
                    <p disabled>R$: {this.state.totalPrice}</p>
                </article>
                
                <button type="submit" onClick={() => this.handlerTotalPrice()}>CALCULAR VALOR<FontAwesome name='dollar' className="font-awesome"/></button>
            </div>
        );
    };
}