import { useRef, useState } from 'react';
import axios from 'axios';

import './App.scss';


const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [tempProduct, setTempProduct] = useState(null);
  
  const [products, setProducts] = useState([]);



  const userNameRaf = useRef(null);
  const passWordRaf = useRef(null);

  const [isAuth, setIsAuth] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const account = {
      username: userNameRaf.current.value,
      password: passWordRaf.current.value
    }

    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `dogfood=${token}; expired=${new Date(expired)}`;
      
      setIsAuth(true);
      
      axios.defaults.headers.common['Authorization'] = token;

      const productsRes = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products`);
      setProducts(productsRes.data.products);

    } catch (err) {
      console.log(err);
    }
  }

  const checkIsLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      alert('使用者已登入！');
      
    } catch (err) {
      console.log(err);
      setIsAuth(false);
    }
  }


  


  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6 ">
              <div className='d-flex flex-column'>
                <button type='button' onClick={checkIsLogin} className='btn btn-success align-self-start mb-3'>檢查使用者是否登入</button>
                <h2 className='align-self-start'>產品列表</h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="images"
                          alt="副圖"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    ref={userNameRaf}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    ref={passWordRaf}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>

                <button className="btn btn-lg btn-primary w-100 mt-3">登入</button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App
