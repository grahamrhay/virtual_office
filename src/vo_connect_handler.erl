-module(vo_connect_handler).

-behaviour(cowboy_websocket_handler).

-export([init/3]).
-export([websocket_init/3]).
-export([websocket_handle/3]).
-export([websocket_info/3]).
-export([websocket_terminate/3]).

init({tcp, http}, _Req, _Opts) ->
    {upgrade, protocol, cowboy_websocket}.

websocket_init(_Type, Req, _Opts) ->
    {ok, Req, #{}}.

websocket_handle({text, Json}, Req, State) ->
    lager:info("Received frame: ~p~n", [Json]),
    Msg = jiffy:decode(Json, [return_maps]),
    Type = maps:get(<<"type">>, Msg),
    Resp = handle_message(Type, Msg),
    {reply, make_frame(Resp), Req, State};

websocket_handle(Frame, Req, State) ->
    lager:error("Unexpected frame: ~p~n", [Frame]),
    {ok, Req, State}.

websocket_info(Info, Req, State) ->
    lager:error("Unexpected msg: ~p~n", [Info]),
    {ok, Req, State}.

make_frame(Msg) ->
    Json = jiffy:encode(Msg),
    {text, Json}.

handle_message(<<"join">>, _Msg) ->
    #{}.

websocket_terminate(_Reason, _Req, _State) ->
    ok.
