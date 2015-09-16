-module(v_office_sup).
-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

init([]) ->
    Procs = [
        {vo_room, {vo_room, start_link, []}, permanent, 5000, worker, [vo_room]}
    ],
    {ok, {{one_for_one, 1, 5}, Procs}}.
