-module(v_office_app).
-behaviour(application).

-export([start/2]).
-export([stop/1]).

start(_Type, _Args) ->
    Dispatch = cowboy_router:compile([{'_', [
        {"/connect", vo_connect_handler, []},
        {"/", cowboy_static, {priv_file, v_office, "static/index.html"}},
        {"/[...]", cowboy_static, {priv_dir, v_office, "static/"}}
    ]}]),
    {ok, _} = cowboy:start_http(my_http_listener, 100, [{port, 8080}],
        [{env, [{dispatch, Dispatch}]}]
    ),
    v_office_sup:start_link().

stop(_State) ->
    ok.
