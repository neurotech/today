.PHONY: all dev start stop restart logs clean prune help

COLOUR_GREEN=\033[0;32m
COLOUR_RED=\033[0;31m
COLOUR_BLUE=\033[0;34m
COLOUR_WHITE=\033[0;37m
COLOUR_GRAY=\033[1;30m
COLOUR_YELLOW=\033[1;33m
COLOUR_PURPLE=\033[1;35m
COLOUR_END=\033[0m

define TODAY_BANNER
$(COLOUR_PURPLE)       ██████                      ██    ██
      ██$(COLOUR_GRAY)░░░░$(COLOUR_PURPLE)██                    $(COLOUR_GRAY)░$(COLOUR_PURPLE)██   $(COLOUR_GRAY)░$(COLOUR_PURPLE)██
    $(COLOUR_GRAY) $(COLOUR_PURPLE)██   $(COLOUR_GRAY) ░░   $(COLOUR_PURPLE)██████    ██████ ██████ $(COLOUR_GRAY)░$(COLOUR_PURPLE)██  █████
    $(COLOUR_GRAY)░$(COLOUR_PURPLE)██        $(COLOUR_GRAY)░░░░░░$(COLOUR_PURPLE)██  ██$(COLOUR_GRAY)░░░░ ░░░$(COLOUR_PURPLE)██$(COLOUR_GRAY)░  ░$(COLOUR_PURPLE)██ ██$(COLOUR_GRAY)░░░$(COLOUR_PURPLE)██
    $(COLOUR_GRAY)░$(COLOUR_PURPLE)██         ███████ $(COLOUR_GRAY)░░$(COLOUR_PURPLE)█████   $(COLOUR_GRAY)░$(COLOUR_PURPLE)██   $(COLOUR_GRAY)░$(COLOUR_PURPLE)██$(COLOUR_GRAY)░$(COLOUR_PURPLE)███████
    $(COLOUR_GRAY)░░$(COLOUR_PURPLE)██    ██$(COLOUR_GRAY) $(COLOUR_PURPLE)██$(COLOUR_GRAY)░░░░$(COLOUR_PURPLE)██  $(COLOUR_GRAY)░░░░░$(COLOUR_PURPLE)██  $(COLOUR_GRAY)░$(COLOUR_PURPLE)██   $(COLOUR_GRAY)░$(COLOUR_PURPLE)██$(COLOUR_GRAY)░$(COLOUR_PURPLE)██$(COLOUR_GRAY)░░░░
     $(COLOUR_GRAY)░░$(COLOUR_PURPLE)██████ $(COLOUR_GRAY)░░$(COLOUR_PURPLE)████████ ██████   $(COLOUR_GRAY)░░$(COLOUR_PURPLE)██  ███$(COLOUR_GRAY)░░$(COLOUR_PURPLE)██████
      $(COLOUR_GRAY)░░░░░░   ░░░░░░░░ ░░░░░░     ░░  ░░░  ░░░░░░
$(COLOUR_END)
endef

export TODAY_BANNER

all: help

dev:
	clear && \
	pnpm install && \
	printf '%b\n' "$$TODAY_BANNER" && \
	pnpm run dev

start:
	clear && \
	printf '%b\n' "$$TODAY_BANNER" && \
	docker compose up -d --quiet-pull --build

stop:
	docker compose stop

restart:
	docker compose restart

logs:
	docker compose logs -f

clean:
	@docker compose down --remove-orphans && \
	docker image rm -f today-today

# Each `make start` rebuild retags today-today:latest and leaves the previous
# image dangling, so these accumulate. System-wide, but only ever touches
# untagged and unreferenced images. Kept separate from `start` because it also
# discards layers the next build would have reused.
prune:
	@docker image prune -f

help:
	@clear
	@printf '%b\n' "$$TODAY_BANNER"
	@printf '%b\n' "   $(COLOUR_WHITE)┌─$(COLOUR_GRAY)──────────────$(COLOUR_WHITE)┬$(COLOUR_GRAY)───────────────────────────────────────────$(COLOUR_WHITE)─┐$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_PURPLE)dev$(COLOUR_END)      $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Start $(COLOUR_RED)Next$(COLOUR_YELLOW) in $(COLOUR_PURPLE)development$(COLOUR_YELLOW) mode.$(COLOUR_END)            $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_GREEN)start$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Build and start in $(COLOUR_RED)DAEMON$(COLOUR_YELLOW) mode.$(COLOUR_END)            $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)stop$(COLOUR_END)     $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Stop the container.$(COLOUR_END)                        $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)logs$(COLOUR_END)     $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Follow container logs.$(COLOUR_END)                     $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)clean$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Stop and remove the container and image.$(COLOUR_END)   $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)prune$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Remove dangling images to reclaim disk.$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_WHITE)└─$(COLOUR_GRAY)──────────────$(COLOUR_WHITE)┴$(COLOUR_GRAY)───────────────────────────────────────────$(COLOUR_WHITE)─┘$(COLOUR_END)"
	@echo ""
