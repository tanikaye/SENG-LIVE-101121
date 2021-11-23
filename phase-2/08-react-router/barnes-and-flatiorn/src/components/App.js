import { useState, useEffect } from "react";

import Header from "./Header";
import BookContainer from "./BookContainer";
import Form from "./Form"
import Search from "./Search";



function App() {
const [allBooks, setAllBooks] = useState([])
const [bookList, setBookList] = useState([])
const [genreList, setGenreList] = useState([])
const [formData, setFormData] = useState({
        title:'',
        author:'',
        genre: '',
        image: '',
        price: '',
        liked: false
    })
const [cart, setCart] = useState([])


useEffect(()=> {
  fetch('http://localhost:4000/books')
  .then(res => res.json())
  .then(books => {
    setBookList(books)
    setAllBooks(books)
  })
},[])

useEffect(()=>{
  fetch('http://localhost:4000/genres')
  .then(res => res.json())
  .then(genres => setGenreList(genres))
},[])

useEffect(() => {
  if(cart.length > 0) alert(`${cart[cart.length-1].title} added to cart`)
},[cart])



const handleChange = (e) => {
    setFormData({...formData, [e.target.name]:e.target.value})
  }


const handleSearch = (e) => {
  const filteredBooks = allBooks.filter(bookObj => bookObj.title.toLowerCase().includes(e.target.value.toLowerCase()))
  setBookList(filteredBooks)
}

const handleGenre = (genreStr) => {
  const filteredBooks = allBooks.filter(bookObj => bookObj.genre.toLowerCase() === genreStr.toLowerCase())
  setBookList(filteredBooks)
}

const handleSubmit = (e) => {
  e.preventDefault()
  fetch('http://localhost:4000/books',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(book => {
    setBookList([book,...bookList])
  })
  
  setFormData({
    title:'',
    author:'',
    genre: '',
    image: '',
    price: '',
    liked: false
})
}

const populateForm = (book) => {
  setFormData({
    title:book.title,
    author:book.author,
    genre: book.genre,
    image: book.image,
    price: book.price,
    like: false
})
}

const addToCart = (book) => {
  setCart([...cart, book])
}

const handleDelete = (bookObj) => {
  fetch(`http://localhost:4000/books/${bookObj.id}`,{
    method:'DELETE'
  })
  .then(() => {
    const filteredBooks = allBooks.filter(book => book.id !== bookObj.id)
    setBookList(filteredBooks)
    setAllBooks(filteredBooks)
  })

}

const handleUpdateLike = (bookObj) => {
  fetch(`http://localhost:4000/books/${bookObj.id}`,{
    method:'PATCH',
    headers:{ 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({liked:!bookObj.liked})
  })
  .then(res => res.json())
  .then(data => {
    const tempBooks = allBooks.map(book => {
      if(book.id === data.id){
        return data
      } else {
        return book
      }
    })
    
    setAllBooks(tempBooks)
    setBookList(tempBooks)
  })
}

  return (
    <div>
      <h3>Cart: {cart.length} </h3>
      <Header storeName="Barnes and Flatiron" slogan="Live Love Code"/>
      <Form handleSubmit={handleSubmit} formData={formData} handleChange={handleChange}/>
      <Search handleSearch={handleSearch}/>
      <BookContainer handleUpdateLike={handleUpdateLike} handleDelete={handleDelete} addToCart={addToCart} populateForm={populateForm} handleGenre={handleGenre} bookList={bookList} genresList={genreList} />
    </div>
  );
}

export default App;
