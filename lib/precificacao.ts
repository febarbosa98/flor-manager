export function calcularPrecoVenda(custo:number){

const margem = 2.2

return Number((custo * margem).toFixed(2))

}