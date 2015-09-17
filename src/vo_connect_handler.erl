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
    ok = gen_server:call(vo_room, {join, self()}),
    {ok, Req, #{}}.

websocket_handle({text, Json}, Req, State) ->
    lager:info("Received frame: ~p~n", [Json]),
    Msg = jiffy:decode(Json, [return_maps]),
    Type = maps:get(<<"type">>, Msg),
    case Type of
        <<"snapshot">> ->
            Data = #{type=><<"snapshot">>, data=>maps:get(<<"data">>, Msg), from=>list_to_binary(pid_to_list(self()))},
            ok = gen_server:call(vo_room, {broadcast, jiffy:encode(Data), self()}),
            {ok, Req, State}
    end.

websocket_info({broadcast, Data}, Req, State) ->
    {reply, {text, Data}, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
    ok = gen_server:call(vo_room, {leave, self()}),
    ok.
