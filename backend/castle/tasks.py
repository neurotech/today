from datetime import datetime
import logging
from apscheduler.schedulers.background import (
    BackgroundScheduler,
)
from apscheduler.triggers.interval import (
    IntervalTrigger,
)


def my_daily_task():
    logger = logging.getLogger("uvicorn.error")
    logger.warning(f"Task is running at {datetime.now()}")


def start_schedule():
    scheduler = BackgroundScheduler()
    trigger = IntervalTrigger(hours=1)
    scheduler.add_job(my_daily_task, trigger)
    scheduler.start()

    return scheduler
