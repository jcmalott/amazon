export default function Order(orderInfo, user) {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const order = {
    orderItems: orderInfo.orderItems.map((x) => ({
      slug: x.slug,
      name: x.name,
      quantity: x.image,
      image: x.image,
      price: x.price,
      product: x._id,
    })),
    shippingAddress: orderInfo.shippingAddress,
    paymentMethod: orderInfo.paymentMethod,
    paymentResults: {
      id: user._id,
      status: "Paid",
      emailAddress: user.email,
      update_time: date + " " + time,
    },
    itemsPrice: orderInfo.itemsPrice,
    shippingPrice: orderInfo.shippingPrice,
    taxPrice: orderInfo.taxPrice,
    totalPrice: orderInfo.totalPrice,
    user_id: user._id,
    isPaid: false,
    paidAt: "",
    isDelivered: false,
    deliveredAt: "",
  };

  return order;
}
