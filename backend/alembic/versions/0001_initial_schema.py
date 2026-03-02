"""Initial schema — create all tables

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Enums ──────────────────────────────────────────────────────────────────
    language_enum = sa.Enum("RU", "KZ", name="language_enum")
    farm_culture_enum = sa.Enum("carrot", "apple", name="farm_culture_enum")
    product_enum = sa.Enum("carrot", "apple", "trout", "honey", name="product_enum")
    order_status_enum = sa.Enum(
        "Created", "Confirmed", "Preparing", "Delivering", "Delivered", "Cancelled",
        name="order_status_enum",
    )

    language_enum.create(op.get_bind(), checkfirst=True)
    farm_culture_enum.create(op.get_bind(), checkfirst=True)
    product_enum.create(op.get_bind(), checkfirst=True)
    order_status_enum.create(op.get_bind(), checkfirst=True)

    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("username", sa.String(64), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(256), nullable=False),
        sa.Column("referral_code", sa.String(16), nullable=False, unique=True),
        sa.Column("language", language_enum, nullable=False, server_default="RU"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("(datetime('now'))"),
        ),
    )
    op.create_index("ix_users_username", "users", ["username"])

    # ── wallets ────────────────────────────────────────────────────────────────
    op.create_table(
        "wallets",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("coins", sa.Integer, nullable=False, server_default="500"),
        sa.Column("water_g", sa.Integer, nullable=False, server_default="1000"),
        sa.Column("oxygen_g", sa.Integer, nullable=False, server_default="1000"),
        sa.Column("syrup_g", sa.Integer, nullable=False, server_default="1000"),
        sa.Column("nutrients", sa.Integer, nullable=False, server_default="5"),
    )

    # ── goodness ───────────────────────────────────────────────────────────────
    op.create_table(
        "goodness",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("value", sa.Integer, nullable=False, server_default="0"),
        sa.Column("goal", sa.Integer, nullable=False, server_default="100"),
        sa.Column("level", sa.Integer, nullable=False, server_default="1"),
    )

    # ── farm_states ────────────────────────────────────────────────────────────
    op.create_table(
        "farm_states",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("active_culture", farm_culture_enum, nullable=False, server_default="carrot"),
        sa.Column("carrot_start_ms", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("carrot_care_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("carrot_nutrients_used", sa.Integer, nullable=False, server_default="0"),
        sa.Column("apple_start_ms", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("apple_care_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("apple_nutrients_used", sa.Integer, nullable=False, server_default="0"),
    )

    # ── fish_states ────────────────────────────────────────────────────────────
    op.create_table(
        "fish_states",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("cycle_start_ms", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("care_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("nutrients_used", sa.Integer, nullable=False, server_default="0"),
    )

    # ── bee_states ─────────────────────────────────────────────────────────────
    op.create_table(
        "bee_states",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("cycle_start_ms", sa.BigInteger, nullable=False, server_default="0"),
        sa.Column("care_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("nutrients_used", sa.Integer, nullable=False, server_default="0"),
    )

    # ── inventory ──────────────────────────────────────────────────────────────
    op.create_table(
        "inventory",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("product", product_enum, nullable=False),
        sa.Column("weight_g", sa.Integer, nullable=False),
        sa.Column("quality", sa.Integer, nullable=False, server_default="50"),
        sa.Column(
            "collected_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("(datetime('now'))"),
        ),
    )
    op.create_index("ix_inventory_user_id", "inventory", ["user_id"])

    # ── orders ─────────────────────────────────────────────────────────────────
    op.create_table(
        "orders",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", order_status_enum, nullable=False, server_default="Created"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("(datetime('now'))"),
        ),
    )
    op.create_index("ix_orders_user_id", "orders", ["user_id"])

    # ── order_items ────────────────────────────────────────────────────────────
    op.create_table(
        "order_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "order_id",
            sa.String(36),
            sa.ForeignKey("orders.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("product", product_enum, nullable=False),
        sa.Column("weight_g", sa.Integer, nullable=False),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])

    # ── delivery_profiles ──────────────────────────────────────────────────────
    op.create_table(
        "delivery_profiles",
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("fio", sa.String(256), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("city", sa.String(128), nullable=True),
        sa.Column("address", sa.String(512), nullable=True),
        sa.Column("comment", sa.String(512), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("delivery_profiles")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("inventory")
    op.drop_table("bee_states")
    op.drop_table("fish_states")
    op.drop_table("farm_states")
    op.drop_table("goodness")
    op.drop_table("wallets")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS order_status_enum")
    op.execute("DROP TYPE IF EXISTS product_enum")
    op.execute("DROP TYPE IF EXISTS farm_culture_enum")
    op.execute("DROP TYPE IF EXISTS language_enum")
