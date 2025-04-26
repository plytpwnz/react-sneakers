import { useEffect, useState } from "react";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";



export default function App() {
  const [items, setItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [cartOpened, setCartOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    async function fetchData(){
      setIsLoading(true)
      const cartResponse = await axios.get('https://6808d589942707d722dff87f.mockapi.io/cart')
      const favoritesResponse = await axios.get('https://680a1df31f1a52874cdf39cb.mockapi.io/favorites')
      const itemsResponse = await axios.get('https://6808d589942707d722dff87f.mockapi.io/items')

      setIsLoading(false)

      setCartItems(cartResponse.data)
      setFavorites(favoritesResponse.data)
      setItems(itemsResponse.data)
    }
    fetchData()
  },[])

  const onAddToCart = (obj) => {
    if (cartItems.find(item => Number(item.id) === Number(obj.id))){
      axios.delete(`https://6808d589942707d722dff87f.mockapi.io/cart/${obj.id}`)
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
    } else {
      axios.post('https://6808d589942707d722dff87f.mockapi.io/cart', obj)
      setCartItems(prev => [...prev, obj])
    }
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://6808d589942707d722dff87f.mockapi.io/cart/${id}`)
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))){
        axios.delete(`https://680a1df31f1a52874cdf39cb.mockapi.io/favorites/${obj.id}`)
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        const { data } = await axios.post('https://680a1df31f1a52874cdf39cb.mockapi.io/favorites', obj)
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => Number(obj.id) === Number(id))
  }

  return (
    <AppContext.Provider 
      value={{ 
        items, 
        cartItems, 
        favorites, 
        isItemAdded, 
        onAddToFavorite, 
        setCartOpened, 
        setCartItems 
        }}
      >
      <div className="wrapper clear">
        {cartOpened && <Drawer items={cartItems} onClose={()=> setCartOpened(false)} onRemove={onRemoveItem} />}
        <Header onClickCart={()=> setCartOpened(true)} />

        <Routes>
          <Route path="/" element={
            <Home 
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
            } 
          />
          <Route path="/favorites" element={<Favorites/>}/>
        </Routes>
      </div>
    </AppContext.Provider>
  )
}

