.PHONY: all start dev rebuild help

COLOUR_GREEN=\033[0;32m
COLOUR_RED=\033[0;31m
COLOUR_BLUE=\033[0;34m
COLOUR_WHITE=\033[0;37m
COLOUR_GRAY=\033[1;30m
COLOUR_YELLOW=\033[1;33m
COLOUR_PURPLE=\033[1;35m
COLOUR_END=\033[0m

define CASTLE_BANNER

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

export CASTLE_BANNER

all: help

start:
	@clear && \
	echo "$$CASTLE_BANNER" && \
	docker compose up -d

dev:
	@clear && \
	echo "$$CASTLE_BANNER" && \
	docker compose up

rebuild:
	@docker compose stop && \
	docker compose rm && \
	docker image rm castle-backend && \
	docker compose up

help:
	@clear
	@echo "$$CASTLE_BANNER"
	@echo "Available commands:"
	@echo "-------------------"
	@echo "  $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_GREEN)start$(COLOUR_END)    |  $(COLOUR_YELLOW)Start in $(COLOUR_RED)DAEMON$(COLOUR_YELLOW) mode.$(COLOUR_END)"
	@echo "  $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)dev$(COLOUR_END)      |  $(COLOUR_YELLOW)Start in $(COLOUR_RED)ATTACHED$(COLOUR_YELLOW) mode.$(COLOUR_END)"
	@echo "  $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)rebuild$(COLOUR_END)  |  $(COLOUR_YELLOW)Stop the containers, remove them, remove the images, and start again in $(COLOUR_RED)ATTACHED$(COLOUR_YELLOW) mode.$(COLOUR_END)"
	@echo ""