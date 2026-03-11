import Link from "next/link"

export default function Navbar(){

return(

<nav className="flex gap-6 p-4 border-b">

<Link href="/">Dashboard</Link>
<Link href="/produtos">Produtos</Link>
<Link href="/vendas">Vendas</Link>

</nav>

)

}