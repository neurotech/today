.PHONY: all start dev clean help

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
	@make clean && \
	clear && \
	echo "$$CASTLE_BANNER" && \
	docker compose up --yes -d --quiet-pull --build

dev:
	@make clean && \
	clear && \
	echo "$$CASTLE_BANNER" && \
	docker compose up --yes --watch

clean:
	@docker compose stop && \
	docker compose rm -f && \
	docker image rm -f castle-backend && \
	docker image rm -f castle-frontend

help:
	@clear
	@echo "$$CASTLE_BANNER"
	@echo "   $(COLOUR_WHITE)┌─$(COLOUR_GRAY)────────────$(COLOUR_WHITE)┬$(COLOUR_GRAY)───────────────────────────────────────────$(COLOUR_WHITE)─┐$(COLOUR_END)"
	@echo "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_GREEN)start$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END)  $(COLOUR_YELLOW)Start in $(COLOUR_RED)DAEMON$(COLOUR_YELLOW) mode.$(COLOUR_END)                     $(COLOUR_GRAY)│$(COLOUR_END)"
	@echo "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)dev$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END)  $(COLOUR_YELLOW)Start in $(COLOUR_RED)ATTACHED$(COLOUR_YELLOW) mode.$(COLOUR_END)                   $(COLOUR_GRAY)│$(COLOUR_END)"
	@echo "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)clean$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END)  $(COLOUR_YELLOW)Stop and remove the containers and images.$(COLOUR_END)$(COLOUR_GRAY)│$(COLOUR_END)"
	@echo "   $(COLOUR_WHITE)└─$(COLOUR_GRAY)────────────$(COLOUR_WHITE)┴$(COLOUR_GRAY)───────────────────────────────────────────$(COLOUR_WHITE)─┘$(COLOUR_END)"
	@echo ""