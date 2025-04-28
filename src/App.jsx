import { useEffect, useState } from "react";
import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";



export default function App() {
  const [items, setItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [cartOpened, setCartOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    async function fetchData(){
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://6808d589942707d722dff87f.mockapi.io/cart'),
          axios.get('https://680a1df31f1a52874cdf39cb.mockapi.io/favorites'),
          axios.get('https://6808d589942707d722dff87f.mockapi.io/items')
        ])

        setIsLoading(false)
        setCartItems(cartResponse.data)
        setFavorites(favoritesResponse.data)
        setItems(itemsResponse.data)
      } catch (error) {
        alert('Ошибка при запросе данных.')
        console.error(error)
      }
    }
    fetchData()
  },[])

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id))
      if (findItem){
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)))
        await axios.delete(`https://6808d589942707d722dff87f.mockapi.io/cart/${findItem.id}`)
      } else {
        setCartItems(prev => [...prev, obj])
        const {data} = await axios.post('https://6808d589942707d722dff87f.mockapi.io/cart', obj)
        setCartItems(prev => prev.map(item => {
          if(item.parentId === data.parentId){
            return {
              ...item,
              id: data.id 
            }
          }
          return item
        }))
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину.')
      console.error(error)
    }
  }

  const onRemoveItem = async (id) => {
    try {
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(id)))
      await axios.delete(`https://6808d589942707d722dff87f.mockapi.io/cart/${id}`)
    } catch (error) {
      alert('Ошибка при удалении из корзины')
      console.error(error)
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))){
        await axios.delete(`https://680a1df31f1a52874cdf39cb.mockapi.io/favorites/${obj.id}`)
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        const { data } = await axios.post('https://680a1df31f1a52874cdf39cb.mockapi.io/favorites', obj)
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
      console.error(error)
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider 
      value={{ 
        items, 
        cartItems, 
        favorites, 
        isItemAdded, 
        onAddToFavorite, 
        onAddToCart,
        setCartOpened, 
        setCartItems 
        }}
      >
      <div className="wrapper clear">
        <Drawer 
          items={cartItems} 
          onClose={()=> setCartOpened(false)} 
          onRemove={onRemoveItem} 
          opened={cartOpened}
        />

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

          <Route path="/orders" element={<Orders/>}/>
        </Routes>
      </div>
    </AppContext.Provider>
  )
}

