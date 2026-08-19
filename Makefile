.PHONY: all dev check start stop restart logs clean prune deploy help

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

# Docker is not installed in every environment this repo is developed in
# (notably WSL, which has no daemon). Without this guard, every container
# target fails with a socket error from `docker compose`, which reads as a
# broken project rather than a missing tool.
DOCKER := $(shell command -v docker 2>/dev/null)
define REQUIRE_DOCKER
@[ -n "$(DOCKER)" ] || { \
	printf '%b\n' "$(COLOUR_RED)No Docker on this machine.$(COLOUR_END)"; \
	printf '%b\n' "Develop with $(COLOUR_PURPLE)make dev$(COLOUR_END), or build on the server with $(COLOUR_GREEN)make deploy$(COLOUR_END)."; \
	exit 1; \
}
endef

# Where `make deploy` builds. Set these per machine, either on the command line
# (`make deploy DEPLOY_HOST=host`) or in an untracked `Makefile.local`, which is
# included below when it exists.
DEPLOY_HOST ?=
DEPLOY_PATH ?= ~/projects/today

-include Makefile.local

all: help

dev:
	clear && \
	pnpm install --prefer-offline && \
	printf '%b\n' "$$TODAY_BANNER" && \
	pnpm run dev

# The two commands worth running before a commit, in one target.
check:
	pnpm run typecheck && pnpm run check

start:
	$(REQUIRE_DOCKER)
	clear && \
	printf '%b\n' "$$TODAY_BANNER" && \
	docker compose up -d --quiet-pull --build

# Deliberately not guarded by REQUIRE_DOCKER: the whole point is to build where
# Docker actually is. Only the remote needs it. `--ff-only` so a diverged
# checkout on the server fails loudly instead of opening a merge in a
# non-interactive shell.
deploy:
	@[ -n "$(DEPLOY_HOST)" ] || { \
		printf '%b\n' "$(COLOUR_RED)DEPLOY_HOST is not set.$(COLOUR_END)"; \
		printf '%b\n' "Pass it (make deploy DEPLOY_HOST=host) or set it in Makefile.local."; \
		exit 1; \
	}
	ssh $(DEPLOY_HOST) 'cd $(DEPLOY_PATH) && git pull --ff-only && docker compose up -d --quiet-pull --build'

stop:
	$(REQUIRE_DOCKER)
	docker compose stop

restart:
	$(REQUIRE_DOCKER)
	docker compose restart

logs:
	$(REQUIRE_DOCKER)
	docker compose logs -f

clean:
	$(REQUIRE_DOCKER)
	@docker compose down --remove-orphans && \
	docker image rm -f today-today

# Each `make start` rebuild retags today-today:latest and leaves the previous
# image dangling, so these accumulate. System-wide, but only ever touches
# untagged and unreferenced images. Kept separate from `start` because it also
# discards layers the next build would have reused.
prune:
	$(REQUIRE_DOCKER)
	@docker image prune -f

help:
	@clear
	@printf '%b\n' "$$TODAY_BANNER"
	@printf '%b\n' "   $(COLOUR_WHITE)┌─$(COLOUR_GRAY)───────────$(COLOUR_WHITE)┬$(COLOUR_GRAY)─────────────────────────────────────────$(COLOUR_WHITE)─┐$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_PURPLE)dev$(COLOUR_END)    $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Start $(COLOUR_RED)Next$(COLOUR_YELLOW) in $(COLOUR_PURPLE)development$(COLOUR_YELLOW) mode.$(COLOUR_END)          $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_PURPLE)check$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Type-check and lint.$(COLOUR_END)                     $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_GREEN)start$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Build and start in $(COLOUR_RED)DAEMON$(COLOUR_YELLOW) mode.$(COLOUR_END)          $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_GREEN)deploy$(COLOUR_END) $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Build and start on the $(COLOUR_RED)remote$(COLOUR_YELLOW) host.$(COLOUR_END)      $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)stop$(COLOUR_END)   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Stop the container.$(COLOUR_END)                      $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_BLUE)logs$(COLOUR_END)   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Follow container logs.$(COLOUR_END)                   $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)clean$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Stop and remove the container and image.$(COLOUR_END) $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_WHITE)make$(COLOUR_END) $(COLOUR_RED)prune$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END) $(COLOUR_YELLOW)Remove dangling images to reclaim disk.$(COLOUR_END)  $(COLOUR_GRAY)│$(COLOUR_END)"
	@printf '%b\n' "   $(COLOUR_WHITE)└─$(COLOUR_GRAY)───────────$(COLOUR_WHITE)┴$(COLOUR_GRAY)─────────────────────────────────────────$(COLOUR_WHITE)─┘$(COLOUR_END)"
	@echo ""
