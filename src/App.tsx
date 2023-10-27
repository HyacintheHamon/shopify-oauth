import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Shopify from "./assets/shopify.svg";

function App() {
  const [domain, setDomain] = useState("videocatch-dev-store");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState<any>([]);
  const [token, setToken] = useState("");

  const handleChange = (event: any) => {
    setDomain(event.target.value);
  };

  async function startOAuth() {
    if (domain.length < 1) {
      alert("Please enter a valid domain name");
    } else {
      try {
        const result = await axios.get("http://localhost:3000/install", {
          params: {
            shop: domain + ".myshopify.com",
          },
        });

        window.location.replace(result.data.redirectUrl);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getProducts() {
    try {
      const result = await axios.get("http://localhost:3000/products", {
        params: {
          shop: domain + ".myshopify.com",
          appToken: token,
        },
      });
      setProducts(result.data.products);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOrders() {
    try {
      const result = await axios.get("http://localhost:3000/orders", {
        params: {
          shop: domain + ".myshopify.com",
          appToken: token,
        },
      });
      console.log(result.data.orders);
      setOrders(result.data.orders);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token && token.length > 0) {
      getProducts();
      getOrders();
    }
  }, [token]);

  useEffect(() => {
    if (window.location.pathname.startsWith("/success")) {
      const token = window.location.pathname.split("=")[1];
      setToken(token);
    }
  }, [window.location.pathname]);

  const renderProducts = () => {
    return (
      <div className="overflow-y-auto mt-6">
        {products &&
          products.map((product: any) => {
            return (
              <div
                key={product.id}
                className="flex flex-row justify-start ml-4 mb-2 border border-gray-200 rounded"
              >
                <img
                  draggable={false}
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-[70px] h-[70px] object-cover rounded-l"
                />
                <div className="ml-3 flex flex-col">
                  <div className="flex flex-col mt-2">
                    <div className="flex flex-row items-center">
                      <span className="text-xs text-black font-medium overflow-hidden max-w-[140px]">
                        {product.title}
                      </span>
                    </div>
                    <div className="flex flex-row mt-1.5">
                      <span className="text-xs text-black font-medium">
                        $ {product.variants[0].price}
                      </span>
                      {/* <div
                            className="text-xs font-bold text-black ml-3 mt-2"
                            dangerouslySetInnerHTML={{
                              __html: product.body_html,
                            }}
                          /> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <div>
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
          >
            <h3 className="sr-only">
              Order placed on{" "}
              <time dateTime={order.createdDatetime}>{order.upated_at}</time>
            </h3>

            <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
              <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                <div>
                  <dt className="font-medium text-gray-900">Order number</dt>
                  <dd className="mt-1 text-gray-500">{order.id}</dd>
                </div>
                <div className="hidden sm:block">
                  <dt className="font-medium text-gray-900">Date placed</dt>
                  <dd className="mt-1 text-gray-500">{order.upated_at}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Total amount</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {order.current_total_price}
                  </dd>
                </div>
              </dl>

              <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                <a className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span>View Order</span>
                  <span className="sr-only">{order.id}</span>
                </a>
                <a
                  href={order.invoiceHref}
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>View Invoice</span>
                  <span className="sr-only">for order {order.number}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen h-full">
      <div className="flex flex-1 flex-col justify-center items-center">
        {window.location.pathname.startsWith("/success") ? (
          <div>
            <div className="rounded-md bg-green-50 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Shopify successfully linked!
                  </h3>
                </div>
              </div>
            </div>
            {renderProducts()}
            {renderOrders()}
          </div>
        ) : (
          <>
            <label
              htmlFor="company-website"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Enter your company's Shopify domain name
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <input
                type="text"
                name="company-website"
                id="company-website"
                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="mystorename"
                onChange={handleChange}
                value={domain}
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                .myshopify.com
              </span>
            </div>
            <button
              type="button"
              className="flex self-center items-center justify-center rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm mt-6"
              onClick={() => startOAuth()}
            >
              <img src={Shopify} alt="Your SVG" className="w-5 mr-2" />
              Link shopify
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
