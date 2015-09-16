PROJECT = v_office
DEPS = cowboy lager jiffy
DEP_COWBOY = git https://github.com/ninenines/cowboy 1.0.3
DEP_LAGER = git https://github.com/basho/lager 3.0.1
DEP_JIFFY = git https://github.com/davisp/jiffy 0.14.3
include erlang.mk
ERLC_OPTS += +'{parse_transform, lager_transform}'
