from app.db.session import SessionLocal
from app.services.seed import run_seed


def main() -> None:
    db = SessionLocal()
    try:
        run_seed(db)
        print("Seeded database with 6 meetings.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
