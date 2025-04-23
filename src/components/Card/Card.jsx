import { useState } from 'react'
import styles from './Card.module.scss'

export default function Card({ title, imageUrl, price, onFavorite, onPlus }){
  const [isAdded, setIsAdded] = useState(false)

  const onClickPlus = () => {
    onPlus({title, imageUrl, price})
    setIsAdded(!isAdded)
  }

  return (
    <div className={styles.card}>
      <div className={styles.favorite}>
        <img src="/img/unliked.svg" alt="Unliked" onClick={onFavorite}/>
      </div>
      <img width={133} height={112} src={imageUrl} alt="Sneakers" />
      <h5>{title}</h5>
      <div className="d-flex justify-between align-center">
        <div className="d-flex flex-column">
          <span>Цена: </span>
          <b>{price}</b>
        </div>
        <img 
          className={styles.plus} 
          onClick={onClickPlus} 
          src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"} 
          alt="Plus"
        />
      </div>
    </div>
  )
}