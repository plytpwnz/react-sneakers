import { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import Drawer from "./components/Drawer";
import Header from "./components/Header";


export default function App() {
  const [items, setItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [cartOpened, setCartOpened] = useState(false)

  useEffect(()=>{
    fetch('https://6808d589942707d722dff87f.mockapi.io/items')
      .then(res => res.json())
      .then(json => setItems(json))
  },[])

  const onAddToCart = (obj) => {
    setCartItems(prev => [...prev, obj])
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  return (
    <>
      <div className="wrapper clear">
        {cartOpened && <Drawer items={cartItems} onClose={()=> setCartOpened(false)} />}
        <Header onClickCart={()=> setCartOpened(true)} />

        <div className="content p-40">
          <div className="d-flex align-center justify-between mb-40">
            <h1>{searchValue ? `Поиск по запросу: "${searchValue}"`: 'Все кроссовки'}</h1>
            <div className="search-block d-flex">
              <img src="/img/search.svg" alt="Search" />
              <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
            </div>
          </div>

          <div className="d-flex flex-wrap">
            {items.map(item => (
              <Card 
                key={item.imageUrl} 
                title={item.title} 
                price={item.price} 
                imageUrl={item.imageUrl}
                onFavorite={()=> console.log('Добавили в закладки')}
                onPlus={(obj)=> onAddToCart(obj)}/>
            ))}
          </div>
          

        </div>
      </div>
    </>
  )
}

