from sqlalchemy.orm import Session, joinedload
from app.models.cart import Cart, CartItem


def get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.menu_item))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if cart:
        return cart

    cart = Cart(user_id=user_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart


def get_cart_item(db: Session, cart_id: int, cart_item_id: int) -> CartItem | None:
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.menu_item))
        .filter(CartItem.cart_id == cart_id, CartItem.id == cart_item_id)
        .first()
    )


def find_matching_item(
    db: Session,
    cart_id: int,
    menu_item_id: int,
    special_instructions: str | None,
) -> CartItem | None:
    return (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart_id,
            CartItem.menu_item_id == menu_item_id,
            CartItem.special_instructions == special_instructions,
        )
        .first()
    )


def add_cart_item(
    db: Session,
    *,
    cart_id: int,
    menu_item_id: int,
    quantity: int,
    special_instructions: str | None = None,
) -> CartItem:
    item = CartItem(
        cart_id=cart_id,
        menu_item_id=menu_item_id,
        quantity=quantity,
        special_instructions=special_instructions,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def save_cart_item(db: Session, item: CartItem) -> CartItem:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_cart_item(db: Session, item: CartItem) -> None:
    db.delete(item)
    db.commit()


def clear_cart(db: Session, cart: Cart) -> None:
    for item in list(cart.items):
        db.delete(item)
    db.commit()
